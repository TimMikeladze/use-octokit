import { Octokit as OctokitClient } from '@octokit/rest';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type OctokitContextInterface = {
  auth: any;
  octokit?: OctokitClient;
};

const OctokitContext = React.createContext<OctokitContextInterface | undefined>(
  undefined
);

type OctokitProps = {
  auth: any;
  children: React.ReactNode;
  octokit?: OctokitClient;
};

const fetcher = async ([endpoint, action, args, auth, client]: [
  string,
  string,
  any,
  any,
  OctokitClient | undefined,
]) => {
  const octokit = (client ||
    new OctokitClient({
      auth,
    })) as OctokitClient;

  if (!auth && !octokit) {
    throw new Error(
      `useOctokit must be used within a OctokitProvider or have the 4th argument of this function set to an object with an auth or octokit property`
    );
  }

  const fn = (octokit.rest as any)?.[endpoint]?.[action];

  if (!fn) {
    throw new Error(`Octokit method ${endpoint}.${action} not found`);
  }

  const res = await fn(args);

  return res.data;
};

export const useOctokit = <
  Endpoint extends keyof RestEndpointMethodTypes,
  Action extends keyof RestEndpointMethodTypes[Endpoint],
  Args extends keyof RestEndpointMethodTypes[Endpoint][Action],
  // @ts-ignore I don't know why this works, but it does 🥲
  Output = RestEndpointMethodTypes[Endpoint][Action]['response']['data'],
>(
  endpoint: Endpoint | null,
  action?: Action,
  args?: RestEndpointMethodTypes[Endpoint][Action][Args],
  options?: Partial<Pick<OctokitProps, 'auth' | 'octokit'>>,
  swr?: Parameters<typeof useSWR>[2]
) => {
  const context = React.useContext<OctokitContextInterface | undefined>(
    OctokitContext
  );

  const auth = options?.auth || context?.auth;
  const octokit = options?.octokit || context?.octokit;

  const hasAuth = auth || octokit;

  const res = useSWR(
    hasAuth && endpoint && action
      ? [endpoint, action, args, auth, octokit]
      : null,
    fetcher,
    swr
  );

  return {
    ...res,
    data: res.data as Output,
  };
};

export const OctokitProvider = (props: OctokitProps) => {
  const value = useMemo(
    () => ({
      auth: props.auth,
      octokit: props.octokit,
    }),
    [props.auth, props.octokit]
  );

  return (
    <OctokitContext.Provider value={value}>
      {props.children}
    </OctokitContext.Provider>
  );
};

export { OctokitProvider as GithubProvider, useOctokit as useGithub };
