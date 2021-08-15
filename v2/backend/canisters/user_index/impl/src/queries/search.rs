use crate::{RuntimeState, RUNTIME_STATE};
use core::cmp::Ordering;
use ic_cdk_macros::query;
use types::CreatedUser;
use types::UserSummary;
use user_index_canister::queries::search::{Response::*, *};

const MAX_SEARCH_TERM_LENGTH: usize = 25;

#[query]
fn search(args: Args) -> Response {
    RUNTIME_STATE.with(|state| search_impl(args, state.borrow().as_ref().unwrap()))
}

fn search_impl(args: Args, runtime_state: &RuntimeState) -> Response {
    let now = runtime_state.env.now();
    let caller = runtime_state.env.caller();
    let users = &runtime_state.data.users;
    let mut search_term = args.search_term;
    search_term.truncate(MAX_SEARCH_TERM_LENGTH);

    // Filter
    let search_term_lower = search_term.to_lowercase();
    let mut matches: Vec<&CreatedUser> = users
        .values()
        .filter_map(|u| u.created_user())
        .filter(|u| username_matches(&search_term_lower, &u.username) && u.principal != caller)
        .collect();

    // Sort
    matches.sort_unstable_by(|u1, u2| order_usernames(&search_term, &u1.username, &u2.username));

    // Page
    let results = matches
        .iter()
        .take(args.max_results as usize)
        .map(|u| {
            let millis_since_last_online = now - u.last_online;
            let seconds_since_last_online = (millis_since_last_online / 1000) as u32;

            UserSummary {
                user_id: u.user_id,
                username: u.username.clone(),
                seconds_since_last_online,
            }
        })
        .collect();

    Success(Result { users: results })
}

fn username_matches(search_term_lower: &str, username: &str) -> bool {
    username.to_lowercase().starts_with(search_term_lower)
}

fn order_usernames(search_term: &str, u1: &str, u2: &str) -> Ordering {
    let u1_starts = u1.starts_with(&search_term);
    let u2_starts = u2.starts_with(&search_term);

    if u1_starts != u2_starts {
        if u1_starts {
            Ordering::Less
        } else {
            Ordering::Greater
        }
    } else {
        match u1.len().cmp(&u2.len()) {
            Ordering::Less => Ordering::Less,
            Ordering::Equal => u1.cmp(u2),
            Ordering::Greater => Ordering::Greater,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::Data;
    use candid::Principal;
    use phonenumber::PhoneNumber;
    use shared::env::test::TestEnv;
    use std::str::FromStr;
    use types::User;
    use types::Version;

    #[test]
    fn search_results_constrained_by_max_results() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 3,
                search_term: "ma".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;
        assert_eq!(3, results.users.len());
    }

    #[test]
    fn search_matches_both_cases() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 10,
                search_term: "mA".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;
        assert_eq!(5, results.users.len());
    }

    #[test]
    fn search_returns_shorter_matches_first() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 2,
                search_term: "ma".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;
        assert_eq!("matt", results.users[0].username);
        assert_eq!("marcus", results.users[1].username);
    }

    #[test]
    fn search_returns_case_sensitive_matches_first() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 2,
                search_term: "jU".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;
        assert_eq!("jUlian", results.users[0].username);
        assert_eq!("julian", results.users[1].username);
    }

    #[test]
    fn search_with_zero_length_term_matches_all_users() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 10,
                search_term: "".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;
        assert_eq!(9, results.users.len());
    }

    #[test]
    fn all_fields_set_correctly() {
        let runtime_state = setup_runtime_state();

        let response = search_impl(
            Args {
                max_results: 10,
                search_term: "hamish".to_string(),
            },
            &runtime_state,
        );

        let Response::Success(results) = response;

        let user = results.users.first().unwrap();
        assert_eq!(user.user_id, Principal::from_slice(&[4, 1]).into());
        assert_eq!(user.username, "hamish");
        assert_eq!(user.seconds_since_last_online, 5);
    }

    fn setup_runtime_state() -> RuntimeState {
        let mut env = TestEnv::default();
        let mut data = Data::default();

        let usernames = vec![
            "mArtin", "marcus", "matt", "julian", "hamish", "Matt", "jUlian", "hamisH", "Martin",
        ];

        for index in 0..usernames.len() {
            let bytes = vec![index as u8, 1];
            let p = Principal::from_slice(&bytes[..]);
            let phone_number = format!("+44 1111 111 11{}", index);

            data.users.add(User::Created(CreatedUser {
                principal: p,
                phone_number: PhoneNumber::from_str(&phone_number).unwrap(),
                user_id: p.into(),
                username: usernames[index].to_string(),
                date_created: env.now,
                date_updated: env.now,
                last_online: env.now,
                upgrade_in_progress: false,
                wasm_version: Version::new(0, 0, 0),
            }));
            env.now += 1000;
        }

        RuntimeState::new(Box::new(env), data)
    }
}
