import request from 'supertest';
import app from '../index.js';
import { resetJobs } from '../routes/jobs.js';

describe('Job Tracker API', () => {
  beforeEach(() => {
    resetJobs();
  });

  describe('GET /api/jobs', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all jobs', async () => {
      await request(app).post('/api/jobs').send({
        company: 'Google',
        title: 'Software Engineer',
        status: 'Applied',
        applicationDate: '2024-01-15'
      });
      
      await request(app).post('/api/jobs').send({
        company: 'Meta',
        title: 'Frontend Developer',
        status: 'Interviewing',
        applicationDate: '2024-01-20'
      });

      const res = await request(app).get('/api/jobs');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const newJob = {
        company: 'Amazon',
        title: 'Backend Developer',
        status: 'Applied',
        applicationDate: '2024-01-25',
        notes: 'Referred by John'
      };

      const res = await request(app).post('/api/jobs').send(newJob);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.company).toBe('Amazon');
    });

    it('should reject job without required fields', async () => {
      const invalidJob = { company: 'Amazon' };
      const res = await request(app).post('/api/jobs').send(invalidJob);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('should update an existing job', async () => {
      const createRes = await request(app).post('/api/jobs').send({
        company: 'Tesla',
        title: 'Engineer',
        status: 'Applied'
      });
      const jobId = createRes.body.id;

      const res = await request(app).put().send({
        company: 'Tesla',
        title: 'Senior Engineer',
        status: 'Interviewing',
        applicationDate: '2024-01-30',
        notes: 'Phone screen completed'
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete an existing job', async () => {
      const createRes = await request(app).post('/api/jobs').send({
        company: 'Netflix',
        title: 'Software Engineer',
        status: 'Applied'
      });
      const jobId = createRes.body.id;

      const res = await request(app).delete();
      expect(res.statusCode).toBe(200);
    });
  });
});
