use crate::model::user::{ConfirmedUser, RegistrationState, User};
use crate::{RuntimeState, RUNTIME_STATE};
use canister_api_macros::trace;
use ic_cdk_macros::update;
use types::{CanisterCreationStatusInternal, PhoneNumber};
use user_index_canister::confirm_phone_number::{Response::*, *};

#[update]
#[trace]
fn confirm_phone_number(args: Args) -> Response {
    RUNTIME_STATE.with(|state| confirm_phone_number_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn confirm_phone_number_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let now = runtime_state.env.now();
    let test_mode = runtime_state.data.test_mode;

    let phone_number: PhoneNumber;
    if let Some(user) = runtime_state.data.users.get_by_principal(&caller) {
        match user {
            User::Unconfirmed(u) => {
                if let RegistrationState::PhoneNumber(p) = &u.state {
                    if now > p.valid_until {
                        return ConfirmationCodeExpired;
                    } else if (args.confirmation_code == p.confirmation_code)
                        || (test_mode && args.confirmation_code == "123456")
                    {
                        phone_number = p.phone_number.clone();
                    } else {
                        return ConfirmationCodeIncorrect;
                    }
                } else {
                    return PhoneNumberNotSubmitted;
                }
            }
            _ => return AlreadyClaimed,
        }
    } else {
        return UserNotFound;
    }

    let user = ConfirmedUser {
        principal: caller,
        phone_number: Some(phone_number),
        username: None,
        date_confirmed: now,
        canister_creation_status: CanisterCreationStatusInternal::Pending(None),
        upgrade_in_progress: false,
    };
    runtime_state.data.users.update(User::Confirmed(user));

    Success
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::user::{UnconfirmedPhoneNumber, UnconfirmedUser};
    use crate::Data;
    use utils::env::test::TestEnv;

    #[test]
    fn correct_code_succeeds() {
        let env = TestEnv::default();
        let confirmation_code = "123456".to_string();
        let mut data = Data::default();
        data.users.add(User::Unconfirmed(UnconfirmedUser {
            principal: env.caller,
            state: RegistrationState::PhoneNumber(UnconfirmedPhoneNumber {
                phone_number: PhoneNumber::new(44, "1111 111 111".to_owned()),
                confirmation_code: confirmation_code.clone(),
                valid_until: env.now + 1000,
                sms_messages_sent: 1,
            }),
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let args = Args { confirmation_code };
        let result = confirm_phone_number_impl(args, &mut runtime_state);
        assert!(matches!(result, Response::Success));

        let user = runtime_state
            .data
            .users
            .get_by_principal(&runtime_state.env.caller())
            .unwrap();
        assert!(matches!(user, User::Confirmed(_)));
    }

    #[test]
    fn incorrect_code_returns_confirmation_code_incorrect() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Unconfirmed(UnconfirmedUser {
            principal: env.caller,
            state: RegistrationState::PhoneNumber(UnconfirmedPhoneNumber {
                phone_number: PhoneNumber::new(44, "1111 111 111".to_owned()),
                confirmation_code: "123456".to_string(),
                valid_until: env.now + 1000,
                sms_messages_sent: 1,
            }),
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let args = Args {
            confirmation_code: "123457".to_string(),
        };
        let result = confirm_phone_number_impl(args, &mut runtime_state);
        assert!(matches!(result, Response::ConfirmationCodeIncorrect));
    }

    #[test]
    fn code_expired_returns_confirmation_code_expired() {
        let confirmation_code = "123456".to_string();
        let mut env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Unconfirmed(UnconfirmedUser {
            principal: env.caller,
            state: RegistrationState::PhoneNumber(UnconfirmedPhoneNumber {
                phone_number: PhoneNumber::new(44, "1111 111 111".to_owned()),
                confirmation_code: confirmation_code.clone(),
                valid_until: env.now + 1000,
                sms_messages_sent: 1,
            }),
        }));
        env.now += CONFIRMATION_CODE_EXPIRY_MILLIS + 1;
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let args = Args { confirmation_code };
        let result = confirm_phone_number_impl(args, &mut runtime_state);
        assert!(matches!(result, Response::ConfirmationCodeExpired));
    }

    #[test]
    fn confirmed_user_returns_already_claimed() {
        let env = TestEnv::default();
        let mut data = Data::default();
        data.users.add(User::Confirmed(ConfirmedUser {
            principal: env.caller,
            phone_number: Some(PhoneNumber::new(44, "1111 111 111".to_owned())),
            date_confirmed: env.now,
            ..Default::default()
        }));
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let args = Args {
            confirmation_code: "123456".to_string(),
        };
        let result = confirm_phone_number_impl(args, &mut runtime_state);
        assert!(matches!(result, Response::AlreadyClaimed));
    }

    #[test]
    fn no_user_returns_user_not_found() {
        let env = TestEnv::default();
        let data = Data::default();
        let mut runtime_state = RuntimeState::new(Box::new(env), data);

        let args = Args {
            confirmation_code: "123456".to_string(),
        };
        let result = confirm_phone_number_impl(args, &mut runtime_state);
        assert!(matches!(result, Response::UserNotFound));
    }
}
