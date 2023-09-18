'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useOctokit } from 'use-octokit';
import styles from './page.module.css';

export default function Example() {
  const session = useSession();

  const user = useOctokit('users', 'getAuthenticated', undefined, {
    auth: session.data?.user?.accessToken,
  });

  const [page, setPage] = useState(0);

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
      refreshInterval: page === 0 ? 1000 * 10 : 0
    }
  );

  return (
    <main className={styles.main}>
      {session.status === 'loading' && <p>Loading...</p>}
      {session.status === 'unauthenticated' && (
        <div>
          <button
            type='button'
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
                type='button'
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
                  type='button'
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
                  type='button' 
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
