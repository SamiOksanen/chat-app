import { Layout, Space, Typography } from "antd";

const { Content } = Layout;
const { Text } = Typography;

interface MessageSubscription {
    data: { messages: [] },
    loading: boolean
};

const ConversationMessageList = (props: MessageSubscription) => {
    const data = props.data;
    const loading = props.loading;
    return <Content style={{ margin: '16px 16px', height: 360, overflowY: 'scroll', position: 'relative', display: 'flex', flexDirection: 'column-reverse' }}>
        <Space className="site-layout-background" style={{ padding: 24, width: '100%', position: 'absolute' }} direction="vertical">
            {props.loading ? <Text key={"loading_messages"}>Loading...</Text> : props.data && props.data.messages.map((msg: { message: string }, ix: any) => <Text key={ix}>{msg.message}</Text>)}
        </Space>
    </Content>;
}

export default ConversationMessageList;