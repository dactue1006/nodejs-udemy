console.log('before');
// getUser(1).then((user)=> {
//   getRepository1(user.username).then()
// });


// write promise
// getUser(1)
//   .then(user => getRepository1(user.username))
//   .then(repos => getCommit1(repos[0]))
//   .then(commits => console.log(commits))
//   .catch(err => console.log(err))

// write using asyn/await
async function displayCommits() {
  const user = await getUser(1);
  console.log(user);
  const repos = await getRepository1(user.username);
  const commits = await getCommit1(repos[0]);
  console.log(commits);
}
displayCommits();
function getRepository(user) {
  console.log(user);
  // get repository
  getRepository1(user.username, getCommit);
}

function getCommit(repos) {
  console.log(repos);
  getCommit1(repos[0], displayCommits);
}


console.log('after');

function getUser(id) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=>{
      console.log('reading...');
      resolve({ id, username: 'tue'});
    }, 3000);
  })
}

function getRepository1(username) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=> {
      console.log('getting repository...');
      resolve(['repo1', 'repo2', 'repo3']);
    }, 1000)
  })
}

function getCommit1(repo) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=> {
      console.log('getting commit...');
      resolve(['commit1', 'commit2'])
    }, 500)
  })
}