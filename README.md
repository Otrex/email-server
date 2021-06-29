# Email Server

**For testing purposes**
To test this package, clone it
`git clone https://git.chigisoft.dev/packages/email-server.git`

pull the test-update branch

Use `yarn link <project_name>` to link it to the host end

**To Setup**

import setupEmailServer from 'email-server'

Pass in the config in the form
`interface Config {
  app?: express.Application;
  db: {
    type: 'mysql' | 'postgres';
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  redis: {
    host: string; // localhost
    port: number; // 6789
  };
  queue: {
    concurrency: number;
    limiter: {
      max: number;
      duration: number;
    };
  };
  mail: {
    key: string;
  };
  env?: string;
}`

Note: `app` is optional as it can be imported from 'email-server/app'
To use the send mail utility `sendMailUtility`, import it from 'email-server/utils'.
The app and the utility is also returned by the setup function
