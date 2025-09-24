import { Layout, Space } from 'antd';
import MessageRenderer from './messages/MessageRenderer';

const { Content } = Layout;

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
                    <MessageRenderer
                        key={'loading_messages'}
                        content="Loading..."
                    />
                ) : (
                    data &&
                    data.messages.map(
                        (msg: { message: string }, ix: number) => (
                            <MessageRenderer
                                key={ix}
                                content={msg.message}
                                style={{ marginBottom: '8px' }}
                            />
                        )
                    )
                )}
            </Space>
        </Content>
    );
};

export default ConversationMessageList;
