export const idlFactory = ({ IDL }) => {
  const CanisterId = IDL.Principal;
  const ChatId = CanisterId;
  const FreezeGroupArgs = IDL.Record({
    'chat_id' : ChatId,
    'reason' : IDL.Opt(IDL.Text),
  });
  const FreezeGroupResponse = IDL.Variant({
    'ChatAlreadyFrozen' : IDL.Null,
    'ChatNotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'Success' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  const SearchArgs = IDL.Record({
    'max_results' : IDL.Nat8,
    'search_term' : IDL.Text,
  });
  const GroupMatch = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'avatar_id' : IDL.Opt(IDL.Nat),
    'chat_id' : ChatId,
  });
  const SearchSuccessResult = IDL.Record({ 'matches' : IDL.Vec(GroupMatch) });
  const SearchResponse = IDL.Variant({
    'TermTooShort' : IDL.Nat8,
    'Success' : SearchSuccessResult,
    'TermTooLong' : IDL.Nat8,
    'InvalidTerm' : IDL.Null,
  });
  const UnfreezeGroupArgs = IDL.Record({ 'chat_id' : ChatId });
  const UnfreezeGroupResponse = IDL.Variant({
    'ChatNotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'Success' : IDL.Null,
    'ChatNotFrozen' : IDL.Null,
    'InternalError' : IDL.Text,
  });
  return IDL.Service({
    'freeze_group' : IDL.Func([FreezeGroupArgs], [FreezeGroupResponse], []),
    'search' : IDL.Func([SearchArgs], [SearchResponse], ['query']),
    'unfreeze_group' : IDL.Func(
        [UnfreezeGroupArgs],
        [UnfreezeGroupResponse],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
