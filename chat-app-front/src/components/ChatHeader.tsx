import { LogoutOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useContext } from 'react';
import { UserContext } from '../App';
import { ThemeContext } from './themes/ThemeProvider';

const ChatHeader = () => {
    const { theme } = useContext(ThemeContext);
    const { changeUser } = useContext(UserContext);
    return (
        // Searchbar here
        <Header
            className="site-layout-background"
            style={{
                background: theme === 'dark' ? '#262626' : '#002140',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
            }}
        >
            <Tooltip title="Log out">
                <Button
                    type="primary"
                    onClick={() =>
                        changeUser && changeUser({ userid: null, token: null })
                    }
                    shape="default"
                    icon={<LogoutOutlined />}
                    size="large"
                    style={{ margin: '12px' }}
                />
            </Tooltip>
        </Header>
    );
};

export default ChatHeader;
