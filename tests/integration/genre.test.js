let server;
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', ()=> {
  beforeEach(()=> { server = require('../../') })
  afterEach(async () => { 
    await server.close();
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

  describe('PUT /:id', () => {
    // is auth
    // is not auth
    // input is invalid: name<5 and name>50 400
    // id is invalid 
    // update success
    let token, genre, id, newName;
    beforeEach(async()=> {
      genre = new Genre({ name: 'nguyen'});
      await genre.save();
      token = new User().generateAuthToken();
      id = genre._id;
      newName = 'tuenguyen';
    })

    const exec = () => {
      return request(server)
        .put('/api/genres/'+id)
        .set('x-auth-token', token)
        .send({ name: newName })
    }

    it('should return 401 if no token is provided', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
      token = '1';
      const res = await exec();
      expect(res.status).toBe(400);
    })
    
    it('should return 400 if input length less than 5', async() => {
      newName = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    })

    it('should return 400 if input greater than 50', async() => {
      newName = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    })

    it('should return 404 if objectId is invalid', async () => {
      id = '1';
      const res = await exec();
      console.log(genre);
      expect(res.status).toBe(404);
    })

    it('should return 404 if is is valid but not exist genre', async() => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    })
    
    it('should update genren if valid id is passed', async() => {
      const res = await exec();
      expect(res.body).toHaveProperty('name', newName);
      expect(res.body).toHaveProperty('_id');
    })

  })

  describe('DELETE /:id', () => {
    let token; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });  
})