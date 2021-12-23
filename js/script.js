// Div for "overview" class, where profile info will appear
const overview = document.querySelector(".overview");
// Github Username
const username = "oliverijoe";
// Unordered list to display the repos list
const repoList = document.querySelector(".repo-list");
// Where repo information will appear
const repoInfoAppear = document.querySelector(".repos");
// Where individual repo data will appear
const repoData = document.querySelector(".repo-data");
// The Back button
const backButton = document.querySelector(".view-repos")
// "Search by name" placeholder input
const filterInput = document.querySelector(".filter-repos")

// API for gathering user info
const gitUserInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};

// Displays user info
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = 
        `<figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of Public Repos:</strong> ${data.public_repos}</p>
        </div>`;
    overview.append(div);
    gitRepos();
};

gitUserInfo();

// API for gathering the user's repos
const gitRepos = async function () {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=update&per_page=100`);
    const repoData = await fetchRepos.json();
    displayRepos(repoData);
};

// Display the blocks of repos to click on
const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

// Listens for clicks on the individual repos for more info
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

// Gathers more specific info about a repo
const getRepoInfo = async function (repoName) {
    const fetchRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();
    //console.log(repoInfo);

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    let languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    
    displayRepoInfo(repoInfo, languages);
};

// Shows the repo information, providing the new HTML code
const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
            <p>Description: ${repoInfo.description}</p>
            <p>Default Branch: ${repoInfo.default_branch}</p>
            <p>Languages: ${languages.join(", ")}</p>
            <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
    repoData.classList.remove("hide");
    repoInfoAppear.classList.add("hide");
    backButton.classList.remove("hide");
};

// Controls the Back Button function
backButton.addEventListener("click", function () {
    // Making the gallery reapper
    repoInfoAppear.classList.remove("hide");
    // Hiding the individual repo info
    repoData.classList.add("hide");
    // Hiding the back button itself
    backButton.classList.add("hide");
});

// Dynamic Search
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLower = searchText.toLowerCase();

    for (const repo of repos) {
        const repoTextLower = repo.innerText.toLowerCase();
        if (repoTextLower.includes(searchLower)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});