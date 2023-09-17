'use client';

import styles from './page.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useOctokit } from 'use-octokit';

export default function Example() {
  const session = useSession();

  const user = useOctokit('users', 'getAuthenticated', undefined, {
    auth: session.data?.user?.accessToken,
  });

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
      refreshInterval: page === 1 ? 0 : 1000 * 5,
    }
  );

  return (
    <main className={styles.main}>
      {session.status === 'loading' && <p>Loading...</p>}
      {session.status === 'unauthenticated' && (
        <div>
          <button
            onClick={() => {
              signIn('github');
            }}
          >
            Sign in with GitHub
          </button>
        </div>
      )}
      {session.status === 'authenticated' && user.data && (
        <>
          <div className={styles.profile}>
            <Image
              alt="User image"
              src={user.data.avatar_url}
              width={100}
              height={100}
            />
            <p>{user.data.name}</p>
            <div>
              <button
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
          </div>

          <hr />
          <div className={styles.repos}>
            <div className={styles.pager}>
              <h2>Recently Updated Next.js Repositories</h2>
              <div>
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                >
                  Prev page
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Next page
                </button>
              </div>
            </div>
            {repos.isLoading ? 'Loading repos...' : ''}
            {repos.data?.items.map((repo) => (
              <div key={repo.id}>
                <div className={styles.repoTitle}>
                  <Link href={repo.html_url}>{repo.full_name}</Link>
                  <div className={styles.stars}>{repo.stargazers_count}⭐️</div>
                </div>
                <p>{repo.description}</p>
                <hr />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
