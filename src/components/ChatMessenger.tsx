'use client';
import { FacebookProvider,CustomChat } from 'react-facebook';

const ChatMessenger = () => {
  return (
    <FacebookProvider appId="61559578600194" chatSupport>
      <CustomChat pageId="462915599485338" minimized={true} />
    </FacebookProvider>
  );
};

export default ChatMessenger;