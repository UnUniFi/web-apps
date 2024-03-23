import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as firestore from '@google-cloud/firestore';
import { projectID } from 'firebase-functions/params';

export const firestoreBackup = onSchedule('0 0 * * *', async (event) => {
  const client = new firestore.v1.FirestoreAdminClient();
  const projectId = projectID.value();
  const databaseName = client.databasePath(projectId, '(default)');
  const bucket = `gs://${projectId}-firestore`;

  return await client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: [],
    })
    .then((responses: any[]) => {
      const response = responses[0];
      console.log(`Operation Name: ${response['name']}`);
      return response;
    })
    .catch((err: Error) => {
      console.error(err);
      throw new Error('Export operation failed');
    });
});
