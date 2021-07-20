use aws_sdk_dynamodb::model::AttributeValue;
use aws_sdk_dynamodb::{Blob, Client};
use lambda_runtime::Error;
use shared::types::CanisterId;
use std::str::FromStr;

pub struct DynamoDbClient {
    client: Client,
}

impl DynamoDbClient {
    pub fn build() -> DynamoDbClient {
        let config = aws_sdk_dynamodb::Config::builder().build();

        let client = Client::from_conf(config);

        DynamoDbClient { client }
    }

    pub async fn get_notification_index_processed_up_to(&self, canister_id: CanisterId) -> Result<Option<u64>, Error> {
        let response = self
            .client
            .get_item()
            .table_name("push_notification_stream_indexes")
            .key("canister_id", AttributeValue::B(Blob::new(canister_id.as_slice().to_vec())))
            .send()
            .await?;

        if let Some(item) = response.item {
            let value = item.get("index").unwrap().as_n().unwrap();
            Ok(Some(u64::from_str(value).unwrap()))
        } else {
            Ok(None)
        }
    }

    pub async fn set_notification_index_processed_up_to(
        &self,
        canister_id: CanisterId,
        notification_index: u64,
    ) -> Result<(), Error> {
        self.client
            .put_item()
            .table_name("push_notification_stream_indexes")
            .item("canister_id", AttributeValue::B(Blob::new(canister_id.as_slice().to_vec())))
            .item("index", AttributeValue::N(notification_index.to_string()))
            .send()
            .await?;

        Ok(())
    }
}
