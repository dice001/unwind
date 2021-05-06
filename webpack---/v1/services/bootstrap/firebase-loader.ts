import loadjs from 'loadjs';

let firebasePollingTimeoutId;
let loadingFirebasePromise;

const loadFirebaseScripts = ({ unpkgUrl }) => {
  return new Promise((resolve) => {
    const files = [
      `${unpkgUrl}/firebase@5.7.3/firebase-app.js`,
      `${unpkgUrl}/firebase@5.7.3/firebase-auth.js`,
      `${unpkgUrl}/firebase@5.7.3/firebase-database.js`,
    ];
    loadjs(files, {
      async: false,
      numRetries: 3,
      before: (path, scriptEl) => {
        scriptEl.crossOrigin = 'anonymous';
      },
      success: () => {
        resolve();
      },
    });
  });
};

const pollUrl = (url: string, { maxAttempts, interval }) => {
  return new Promise((resolve) => {
    const pollInternal = (numberOfAttempt = 1) => {
      fetch(url)
        .then((res) => res.json())
        .then(async (res) => {
          if (res || numberOfAttempt === maxAttempts) {
            resolve();
          } else {
            firebasePollingTimeoutId = setTimeout(
              () => pollInternal(++numberOfAttempt),
              interval,
            );
          }
        })
        .catch(() => resolve());
    };
    return pollInternal();
  });
};

const getFirebaseEventsUrl = async (chatToken: string) => {
  const realtimeToken = await fetch('/_api/chat-web/v1/real-time-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: chatToken,
    }),
  }).then((res) => res.json());

  const firebaseToken = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${realtimeToken.options.apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        token: realtimeToken.authKey,
        returnSecureToken: true,
      }),
    },
  ).then((res) => res.json());

  return `${realtimeToken.options.databaseURL}${realtimeToken.eventsPath.substr(
    1,
  )}.json?auth=${firebaseToken.idToken}`;
};

export const lazilyLoadFirebase = async (
  unpkgUrl: string,
  chatToken: string,
  maxDelay: number,
  interval: number,
) => {
  const maxAttempts = Math.floor(maxDelay / interval);

  await getFirebaseEventsUrl(chatToken)
    .then((eventsUrl) =>
      pollUrl(eventsUrl, {
        interval,
        maxAttempts,
      }),
    )
    .catch(() => Promise.resolve());

  return loadFirebase(unpkgUrl);
};

export const loadFirebase = (unpkgUrl: string) => {
  if (!loadingFirebasePromise) {
    if (firebasePollingTimeoutId) {
      window.clearTimeout(firebasePollingTimeoutId);
      firebasePollingTimeoutId = undefined;
    }
    loadingFirebasePromise = loadFirebaseScripts({ unpkgUrl });
  }
  return loadingFirebasePromise;
};
