fetch('data/posts.json')
  .then(res => res.json())
  .then(posts => {
    const postsContainer = document.querySelector('.post-container'); // pojedynczy element

    posts.forEach(post => {
      const postHTML = `
        <div class="post">
          <div class="same-pose">
            <div class="label">${post.label}</div>
            <h1>${post.title}</h1>
          </div>
          <div class="post-info">
            <span class="full-name">
              <img src="${post.avatarSrc}" class="avatar" alt="${post.author}">
              ${post.author}
            </span>
            <div class="time">
              <div>
                <svg class="w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12">
                  <path stroke="currentColor" d="M.667.667h10.667v10.667H.667z"></path>
                  <path stroke="currentColor" d="M6 2.667V6h3.333"></path>
                </svg>
                ${post.timeNeeded}
              </div>
              ${post.timestamp}                    
            </div>
          </div>
        </div>
      `;
      postsContainer.innerHTML += postHTML; // dodaje string HTML do kontenera
    });
  })
  .catch(err => console.error('Błąd wczytywania JSON:', err));
