use crate::members_map::MembersMap;
use crate::GroupMemberInternal;
use candid::{Deserialize, Principal};
use serde::Serialize;
use serde_bytes::ByteBuf;
use stable_memory_map::{with_map, with_map_mut, Key, MemberKey, MemberKeyPrefix};
use types::{MultiUserChat, UserId};

#[derive(Serialize, Deserialize)]
pub struct MembersStableStorage {
    prefix: MemberKeyPrefix,
}

impl MembersStableStorage {
    // TODO delete this after next upgrade
    pub fn new_empty() -> Self {
        MembersStableStorage {
            prefix: MemberKeyPrefix::new_from_chat(MultiUserChat::Group(Principal::anonymous().into())),
        }
    }

    #[allow(dead_code)]
    pub fn new(chat: MultiUserChat, member: GroupMemberInternal) -> Self {
        let mut map = MembersStableStorage {
            prefix: MemberKeyPrefix::new_from_chat(chat),
        };
        map.insert(member);
        map
    }

    pub fn set_chat(&mut self, chat: MultiUserChat) {
        self.prefix = MemberKeyPrefix::new_from_chat(chat);
    }

    // Used to efficiently read all members from stable memory when migrating a group into a community
    pub fn read_members_as_bytes(&self, after: Option<UserId>, max_bytes: usize) -> Vec<ByteBuf> {
        let start_key = match after {
            None => self.prefix.create_key(Principal::from_slice(&[]).into()),
            Some(user_id) => self.prefix.create_key(user_id),
        };

        with_map(|m| {
            let mut total_bytes = 0;
            m.range(Key::from(start_key.clone())..)
                .map_while(|(k, v)| MemberKey::try_from(k).ok().map(|k| (k, v)))
                .skip_while(|(k, _)| *k == start_key)
                .take_while(|(k, _)| k.matches_prefix(&self.prefix))
                .map(|(_, v)| ByteBuf::from(v))
                .take_while(|v| {
                    total_bytes += v.len();
                    total_bytes < max_bytes
                })
                .collect()
        })
    }
}

impl MembersMap for MembersStableStorage {
    fn get(&self, user_id: &UserId) -> Option<GroupMemberInternal> {
        with_map(|m| m.get(&self.prefix.create_key(*user_id).into()).map(|v| bytes_to_member(&v)))
    }

    fn insert(&mut self, member: GroupMemberInternal) {
        with_map_mut(|m| m.insert(self.prefix.create_key(member.user_id).into(), member_to_bytes(&member)));
    }

    fn remove(&mut self, user_id: &UserId) -> Option<GroupMemberInternal> {
        with_map_mut(|m| {
            m.remove(&self.prefix.create_key(*user_id).into())
                .map(|v| bytes_to_member(&v))
        })
    }

    #[cfg(test)]
    fn all_members(&self) -> Vec<GroupMemberInternal> {
        with_map(|m| {
            m.range(Key::from(self.prefix.create_key(Principal::from_slice(&[]).into()))..)
                .map_while(|(k, v)| MemberKey::try_from(k).ok().map(|k| (k, v)))
                .take_while(|(k, _)| k.matches_prefix(&self.prefix))
                .map(|(_, v)| bytes_to_member(&v))
                .collect()
        })
    }
}

// Used to write all members to stable memory when migrating a group into a community
pub fn write_members_from_bytes(chat: MultiUserChat, members: Vec<ByteBuf>) -> Option<UserId> {
    let prefix = MemberKeyPrefix::new_from_chat(chat);
    let mut latest = None;
    with_map_mut(|m| {
        for byte_buf in members {
            let bytes = byte_buf.into_vec();
            let member = bytes_to_member(&bytes);
            latest = Some(member.user_id);
            m.insert(prefix.create_key(member.user_id).into(), bytes);
        }
    });
    latest
}

fn member_to_bytes(member: &GroupMemberInternal) -> Vec<u8> {
    msgpack::serialize_then_unwrap(member)
}

fn bytes_to_member(bytes: &[u8]) -> GroupMemberInternal {
    msgpack::deserialize_then_unwrap(bytes)
}
