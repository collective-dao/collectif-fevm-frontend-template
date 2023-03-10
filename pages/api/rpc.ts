import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { CHAINS } from '../../sdk/constants';
import {
  wrapRequest,
  defaultErrorHandler,
} from '@lidofinance/next-api-wrapper';
import getConfig from 'next/config';
import { fetchWithFallbacks } from 'utils/fetchWithFallbacks';
import { serverLogger } from 'utils/serverLogger';

const { serverRuntimeConfig } = getConfig();
const { apiProviderUrls } = serverRuntimeConfig;

type Rpc = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const rpc: Rpc = async (req, res) => {
  serverLogger.debug('Request to RPC');
  const chainId = Number(req.query.chainId);


  if (!CHAINS[chainId]) {
    throw new Error(`Chain ${chainId} is not supported`);
  }

  const customProvider = apiProviderUrls?.[chainId];
  
  const requested = await fetchWithFallbacks([customProvider], {
    method: 'POST',
    // Next by default parses our body for us, we don't want that here
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  });


  res.setHeader(
    'Content-Type',
    requested.headers.get('Content-Type') ?? 'application/json',
  );

  res.status(requested.status).send(requested.body);
};

// Error handler wrapper
export default wrapRequest([
  defaultErrorHandler({ serverLogger: serverLogger }),
])(rpc);

// export default rpc;
