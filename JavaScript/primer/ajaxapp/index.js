class GithubUserInfo {
  async init() {
    const userId = this.getUserId();
    const userInfo = await this.fetchUserInfo(userId);
    const view = this.createView(userInfo);
    this.displayView(view);
  }

  async fetchUserInfo(userID) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(userID)}`
      );
      return response.json();
    } catch (error) {
      console.error(`${response.status}: ${response.statusText}`);
    }
  }

  getUserId() {
    return document.getElementById("userId").value;
  }

  createView(userInfo) {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
  }

  displayView(view) {
    const result = document.getElementById("result");
    result.innerHTML = view;
  }
}

// HTMLのエスケープ処理
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
