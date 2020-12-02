import fs from 'fs';
import {prisma} from '../../prisma/generated/prisma/index';
import seedDatabase, {scheduleOne} from '../../tests/utils/seedDatabase';

import createDoc from './createOdtDoc.js';

beforeEach(seedDatabase);

test('Should throw error, do not create document in filesystem', async () => {
  const scheduleForDoc = await prisma.schedule({
    id: scheduleOne.schedule.id,
  });

  const originalFsWriteFileSync = fs.writeFileSync;

  fs.writeFileSync = jest.fn().mockImplementation(() => {
    throw new Error('test');
  });

  expect(() => createDoc(scheduleForDoc, 'test', 'en')).toThrowError('test');

  fs.writeFileSync = originalFsWriteFileSync;
});
