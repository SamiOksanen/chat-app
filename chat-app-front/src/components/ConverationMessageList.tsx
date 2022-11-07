import { Layout, Space, Typography } from 'antd';

const { Content } = Layout;
const { Text } = Typography;

export type Messages = {
    messages: [];
};

interface MessageSubscription {
    data?: Messages;
    loading: boolean;
}

const ConversationMessageList = (props: MessageSubscription) => {
    const { data, loading } = props;
    return (
        <Content
            style={{
                margin: '16px 16px',
                height: 360,
                overflowY: 'scroll',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column-reverse',
            }}
        >
            <Space
                className="site-layout-background"
                style={{ padding: 24, width: '100%', position: 'absolute' }}
                direction="vertical"
            >
                {loading ? (
                    <Text key={'loading_messages'}>Loading...</Text>
                ) : (
                    data &&
                    data.messages.map(
                        (msg: { message: string }, ix: number) => (
                            <Text key={ix}>{msg.message}</Text>
                        )
                    )
                )}
            </Space>
        </Content>
    );
};

export default ConversationMessageList;
