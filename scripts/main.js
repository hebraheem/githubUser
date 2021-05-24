require("dotenv").config();
const uri = "https://api.github.com/graphql";
const token = process.env.API_KEY;
let userImage = document.querySelector(".avatar");
let topAvatar = document.querySelector(".user-image");
let Name = document.querySelector(".name");
let User = document.querySelector(".user-name");
let profession = document.querySelector(".profession");
let repoCount = document.querySelector(".rep-count");
let publicRepoCount = document.querySelector(".count");
let repoInfo = document.querySelector(".repo-content");
let emoji = document.querySelector(".emoji");
let findSearch = document.querySelector(".rep-input");
const userLogin = window.location.hash.substring(1);

const query = `
  query ($login: String!, $name: String!) {
    user(login: $login) {
      avatarUrl
      anyPinnableItems
      bio
      company
      email
      id
      location
      name
      websiteUrl
      url
      repository(name:$name){
      id
      createdAt
      forkCount
      stargazerCount
      description
      name
      primaryLanguage{
        color
        id
        name
      }
    }
      twitterUsername
      status{
        emoji
        emojiHTML
      }
      repositories(first: 20 ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        totalCount
        nodes {
          createdAt
          updatedAt
          description
          primaryLanguage {
            color
            id
            name
          }
          isFork
          id
          stargazerCount
          forkCount
          isLocked
          isPrivate
          isEmpty
          homepageUrl
          name
        }
      }
    }
  }
`;

const dateTranaformer = (isoDate) => {
  let options = { day: "numeric", month: "short" };
  const localDateString = new Date(isoDate).toLocaleString("en-US", options);
  return localDateString;
};

const fetchData = fetch(uri, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
    Accept: "application/vnd.github.package-deletes-preview+json",
  },
  body: JSON.stringify({
    query,
    variables: {
      login: userLogin,
      name: findSearch.value,
    },
  }),
})
  .then((res) => res.json())
  .then((data) => {
    const user = data?.data?.user;
    const userNameArray = user?.url?.split("/");
    const repoArray = user?.repositories?.nodes;
    const publicRepo = repoArray?.map((repo) => repo !== repo?.isPrivate);
    let userName = userNameArray[userNameArray?.length - 1];
    topAvatar.src = user?.avatarUrl;
    userImage.src = user?.avatarUrl;
    Name.innerHTML = user?.name;
    User.innerHTML = userName;
    profession.innerHTML = user?.bio;
    emoji.innerHTML =
      user?.status?.emojiHTML !== undefined ? user?.status?.emojiHTML : "";
    repoCount.innerHTML = user?.repositories?.totalCount;
    publicRepoCount.innerHTML = publicRepo?.length;
    let repos = `<p style="display: none"></p>`;
    repoArray?.forEach(function (repo) {
      repos += `<div class="repo-info">
                  <div class="repository">
                    <h3 class="repo-name">${repo?.name}</h3>
                    <p class="repo-desc">${
                      repo?.description === null ? "" : repo?.description
                    }</p>
                    <div style="display: flex; align-items: center;">
                        <p style="background-color: ${
                          repo?.primaryLanguage?.color
                        }"></p>
                        <p class="repo-language">
                            ${
                              repo?.primaryLanguage?.name
                            }<i class="fal fa-star repo-lang-icon"></i><span>${
        repo?.stargazerCount
      }</span> <i
                                class="fal fa-code-branch repo-lang-icon fork-count"></i><span> ${
                                  repo?.forkCount
                                } <span
                                    class="updated">updated on ${dateTranaformer(
                                      repo?.updatedAt
                                    )}
                            </span></span>
                        </p>
                    </div>
                  </div>
                  <div class="star-btn">
                    <button class="star-btn"><i class="fal fa-star"></i> star</button>
                  </div>
      </div>
                <hr>`;
    });

    repoInfo.innerHTML = repos;
  })
  .catch((err) => console.log(err));
