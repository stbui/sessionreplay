# sessionreplay

## 浏览器客户端

```
"@openreplay/tracker": "^4.1.7"
```

```js
import OpenReplay from '@openreplay/tracker';
//...
const tracker = new OpenReplay({
    projectKey: 'FC8cwpO5yLvmHKidhn6X',
    defaultInputMode: 0,
    obscureTextNumbers: false,
    obscureTextEmails: true,
    ingestPoint: 'http://127.0.0.1:8888',
    __DISABLE_SECURE_MODE: true,
});

tracker.start();
```

### 服务端
