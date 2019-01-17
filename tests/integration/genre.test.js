let server;
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', ()=> {
  beforeEach(()=> { server = require('../../') })
  afterEach(async () => { 
    server.close();
    await Genre.deleteMany({});
  })

  describe('GET /',() => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ])

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    })
  })

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    })

    it('should return status 404 if invalid is id passed', async() => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    })

    it('should return status 404 if genre is not exist', async() => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/'+id);
      expect(res.status).toBe(404);
    })
  })

  describe('POST /', () => {
    let token, name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    })

    it('should return 401 unauthorization', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    })

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    })

    it('should return 400 if genre is greater than 50 characters', async () => {
      name = new Array(52).fill('a');

      const res =  await exec();

      expect(res.status).toBe(400);
    })

    it('should save genre if it is valid', async () => {
      await exec();
      
      const genre = await Genre.findOne({ name: 'genre1' });

      expect(genre).not.toBeNull();
    })

    it('should return genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name');
    })
  })
})