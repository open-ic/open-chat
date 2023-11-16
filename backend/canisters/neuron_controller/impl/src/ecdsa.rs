use ic_cdk::api::call::CallResult;
use ic_cdk::api::management_canister::ecdsa::{EcdsaCurve, EcdsaKeyId, EcdsaPublicKeyArgument, SignWithEcdsaArgument};
use ic_transport_types::{to_request_id, EnvelopeContent};
use serde::Serialize;

pub fn get_key_id(is_local_dev_mode: bool) -> EcdsaKeyId {
    let key_name = if is_local_dev_mode { "dfx_test_key" } else { "key_1" };

    EcdsaKeyId {
        curve: EcdsaCurve::Secp256k1,
        name: key_name.to_string(),
    }
}

pub async fn get_public_key(key_id: EcdsaKeyId) -> CallResult<Vec<u8>> {
    ic_cdk::api::management_canister::ecdsa::ecdsa_public_key(EcdsaPublicKeyArgument {
        canister_id: None,
        derivation_path: Vec::new(),
        key_id,
    })
    .await
    .map(|res| res.0.public_key)
}

pub async fn sign_envelope(content: EnvelopeContent, public_key: Vec<u8>, key_id: EcdsaKeyId) -> Result<Vec<u8>, String> {
    let request_id = to_request_id(&content).unwrap();

    let signature = sign(key_id, *request_id).await.unwrap();

    let envelope = Envelope {
        content: content.clone(),
        sender_pubkey: Some(public_key),
        sender_sig: Some(signature.clone()),
    };

    let mut serialized_bytes = Vec::new();
    let mut serializer = serde_cbor::Serializer::new(&mut serialized_bytes);
    serializer.self_describe().unwrap();
    envelope.serialize(&mut serializer).unwrap();

    Ok(serialized_bytes)
}

async fn sign(key_id: EcdsaKeyId, message_hash: [u8; 32]) -> CallResult<Vec<u8>> {
    ic_cdk::api::management_canister::ecdsa::sign_with_ecdsa(SignWithEcdsaArgument {
        message_hash: message_hash.to_vec(),
        derivation_path: Vec::new(),
        key_id,
    })
    .await
    .map(|res| res.0.signature)
}

#[derive(Serialize)]
struct Envelope {
    content: EnvelopeContent,
    #[serde(with = "serde_bytes")]
    sender_pubkey: Option<Vec<u8>>,
    #[serde(with = "serde_bytes")]
    sender_sig: Option<Vec<u8>>,
}
