use crate::model::runtime_state::RuntimeState;
use crate::model::user::User;
use crate::model::user_map::UpdateUserResult;
use candid::CandidType;
use serde::Deserialize;

const MAX_USERNAME_LENGTH: u16 = 25;
const MIN_USERNAME_LENGTH: u16 = 2;
const INVALID_CHARS: [char; 2] = [' ', ','];

pub fn update(request: Request, runtime_state: &mut RuntimeState) -> Response {
    let caller = &runtime_state.env.caller();
    let now = runtime_state.env.now();

    runtime_state.data.users.mark_online(caller, now);

    let username = request.username;

    if username.len() > MAX_USERNAME_LENGTH as usize {
        return Response::UsernameTooLong(MAX_USERNAME_LENGTH);
    }

    if username.len() < MIN_USERNAME_LENGTH as usize {
        return Response::UsernameTooShort(MIN_USERNAME_LENGTH);
    }

    if username.chars().any(|c| INVALID_CHARS.contains(&c)) {
        return Response::UsernameInvalid;
    }

    if let Some(user) = runtime_state.data.users.get_by_principal(caller) {
        if matches!(user, User::Unconfirmed(_)) {
            Response::UserUnconfirmed
        } else {
            let mut user = user.clone();
            user.set_username(username);
            match runtime_state.data.users.update(user) {
                UpdateUserResult::Success => Response::Success,
                UpdateUserResult::UsernameTaken => Response::UsernameTaken,
                _ => Response::UserNotFound,
            }
        }
    } else {
        Response::UserNotFound
    }
}

#[derive(Deserialize)]
pub struct Request {
    username: String,
}

#[allow(dead_code)]
#[derive(CandidType)]
pub enum Response {
    Success,
    UsernameTaken,
    UserUnconfirmed,
    UserNotFound,
    UsernameInvalid,
    UsernameTooShort(u16),
    UsernameTooLong(u16),
}

#[cfg(test)]
mod tests {
    use super::*;
    use candid::Principal;
    use crate::model::data::Data;
    use crate::model::user::{CreatedUser, UnconfirmedUser};
    use crate::test::env::TestEnv;
    use phonenumber::PhoneNumber;
    use std::str::FromStr;

    #[test]
    fn valid_username_succeeds() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "xyz".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::Success));

        let user = runtime_state
            .data
            .users
            .get_by_username("xyz")
            .unwrap();

        assert_eq!(user.get_username().unwrap(), "xyz");
    }

    #[test]
    fn no_change_to_username_succeeds() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "abc".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::Success));
    }

    #[test]
    fn username_taken() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: Principal::from_slice(&[1]),
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        data.users.add(User::Created(CreatedUser {
            principal: Principal::from_slice(&[2]),
            phone_number: PhoneNumber::from_str("+44 2222 222 222").unwrap(),
            user_id: Principal::from_slice(&[2]),
            username: "xyz".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "xyz".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::UsernameTaken));
    }

    #[test]
    fn unconfirmed_user() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Unconfirmed(UnconfirmedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            confirmation_code: "123456".to_string(),
            date_generated: env.now,
            sms_messages_sent: 1,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "abc".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::UserUnconfirmed));
    }

    #[test]
    fn invalid_username() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "a a".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::UsernameInvalid));
    }

    #[test]
    fn username_too_short() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "a".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::UsernameTooShort(2)));
    }

    #[test]
    fn username_too_long() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Created(CreatedUser {
            principal: env.caller,
            phone_number: PhoneNumber::from_str("+44 1111 111 111").unwrap(),
            user_id: Principal::from_slice(&[1]),
            username: "abc".to_string(),
            date_created: env.now,
            last_online: env.now,
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let request = Request {
            username: "abcdefghijklmnopqrstuvwxyz".to_string()
        };
        let result = update(request, &mut runtime_state);
        assert!(matches!(result, Response::UsernameTooLong(25)));
    }
}
