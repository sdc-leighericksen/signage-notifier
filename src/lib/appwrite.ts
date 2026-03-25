import { Client, Databases } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../config';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
