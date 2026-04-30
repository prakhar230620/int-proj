const request = require('supertest');
const app = require('../index');
const Note = require('../models/Note');

describe('Notes & Folders Endpoints', () => {
  let token;
  let noteId;
  let folderId;

  beforeEach(async () => {
    // Register a user to test auth flow
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Notes User',
        email: 'notesuser@example.com',
        password: 'password123',
      });
    
    token = res.body.token;
  });

  it('should create a new folder and a note inside it', async () => {
    const folderRes = await request(app)
      .post('/api/folders')
      .set('x-auth-token', token)
      .send({
        name: 'Work',
        color: '#ff0000',
      });
    
    expect(folderRes.statusCode).toEqual(200);
    folderId = folderRes.body._id;

    const res = await request(app)
      .post('/api/notes')
      .set('x-auth-token', token)
      .send({
        title: 'Project Setup',
        type: 'checklist',
        checklist: [{ text: 'Task 1', isCompleted: false }],
        folder: folderId,
        tags: ['important']
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.folder._id).toEqual(folderId);
    expect(res.body.checklist.length).toEqual(1);
    noteId = res.body._id;
  });

  it('should retrieve all active notes', async () => {
    await request(app).post('/api/notes').set('x-auth-token', token).send({ title: 'Active Note 1' });
    await request(app).post('/api/notes').set('x-auth-token', token).send({ title: 'Archived Note 1', isArchived: true });

    const res = await request(app)
      .get('/api/notes')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should update a note checklist item', async () => {
    const noteRes = await request(app)
      .post('/api/notes')
      .set('x-auth-token', token)
      .send({ title: 'Tasks', type: 'checklist', checklist: [{ text: 'Task A', isCompleted: false }] });
    
    const res = await request(app)
      .put(`/api/notes/${noteRes.body._id}`)
      .set('x-auth-token', token)
      .send({
        checklist: [{ text: 'Task A', isCompleted: true }]
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.checklist[0].isCompleted).toEqual(true);
  });

  it('should soft-delete a note to trash', async () => {
    const noteRes = await request(app)
      .post('/api/notes')
      .set('x-auth-token', token)
      .send({ title: 'To Delete' });
    
    const id = noteRes.body._id;

    const res = await request(app)
      .put(`/api/notes/${id}`)
      .set('x-auth-token', token)
      .send({
        isTrashed: true
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.isTrashed).toEqual(true);
  });

  it('should delete a folder and verify response', async () => {
    const folderRes = await request(app)
      .post('/api/folders')
      .set('x-auth-token', token)
      .send({ name: 'Temp Folder' });
    
    const res = await request(app)
      .delete(`/api/folders/${folderRes.body._id}`)
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('Folder removed');
  });

  it('should mock AI summarize route', async () => {
    const res = await request(app)
      .post('/api/ai/summarize')
      .set('x-auth-token', token)
      .send({
        text: 'This is a long note about important stuff that needs to be summarized'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('summary');
  });
});
