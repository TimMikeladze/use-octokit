# 🐙 use-octokit

A fully-typed data-fetching hook for the Github API. Built on top of [Octokit](https://github.com/octokit/rest.js) and [SWR](https://swr.vercel.app/).

Use this hook inside a React component for a type-safe, data-fetching experience with caching, polling, and more.

> 💡 Checkout an [example](https://github.com/TimMikeladze/use-octokit/blob/master/examples/nextjs) of `use-octokit` inside a [Next.js app](https://github.com/TimMikeladze/use-octokit/blob/master/examples/nextjs).

## 📡 Install

```console
npm install use-octokit

yarn add use-octokit

pnpm add use-octokit
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting Started

After you've obtained a github auth token, you can use the `useOctokit` hook to fetch data from the Github API.

The function inputs and outputs are all type-safe and the auto-complete in your IDE should kick-in to list all the available GitHub API endpoints and parameters.

You can also use the `OctokitProvider` to set the auth token for all the `useOctokit` calls in your app. It also accepts an octokit instance if you want to use your own.

Conditional fetching is supported by passing `undefined` as the first argument to `useOctokit` or by omitting the `auth` config.

Remember this is an [SWR](https://swr.vercel.app/docs/getting-started) hook, so you can use all the [SWR config options](https://swr.vercel.app/docs/options) to customize the fetching behavior or nest it within your own SWR providers.

**React hook example**

```tsx
import { useOctokit } from 'use-octokit';

// call the hook inside a React component

const user = useOctokit('users', 'getAuthenticated', undefined, {
  auth: session.data?.user?.accessToken,
});

// The above is fully-typed SWR response object with the data, error and isLoading properties.
// user.isLoading
// user.data.avatar_url

const [page, setPage] = useState(1);

const repos = useOctokit(
  'search',
  'repos',
  {
    sort: 'updated',
    q: 'nextjs',
    page,
  },
  {
    auth: session.data?.user?.accessToken,
  },
  {
    refreshInterval: page === 1 ? 5000 : 0,
  }
);

// The final argument is an optional SWR config object.
// repos.isLoading
// repos.data.items[0].full_name

if (repos.isLoading || user.isLoading) {
  return <div>Loading...</div>;
}
```

**React context provider example**

```tsx
import { OctokitProvider } from 'use-octokit';

// inside a React component render method

// pass an auth token to the provider to use it for all the useOctokit calls in your app
return (
  <OctokitProvider auth={session.data?.user?.accessToken}>
    {children}
  </OctokitProvider>
);
```

> 😅 Do you have problems consistently typing "octokit" without typos like I do? All the exports have a "github" alias, so you can use `useGithub` instead of `useOctokit` if you need.
