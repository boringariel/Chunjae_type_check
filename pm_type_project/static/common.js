document.addEventListener("DOMContentLoaded", () => {
  fetch("/static/header.html")  // 같은 폴더 내 header.html 파일 호출
    .then(response => {
      if (!response.ok) {
        throw new Error("헤더 불러오기 실패");
      }
      return response.text();
    })
    .then(html => {
      const headerContainer = document.createElement("div");
      headerContainer.innerHTML = html;
      // 문서 body 최상단에 삽입
      document.body.insertBefore(headerContainer, document.body.firstChild);
    })
    .catch(err => {
      console.error("헤더 삽입 오류:", err);
    });
});

window.addEventListener("DOMContentLoaded", () => {
  fetch("/static/footer.html")
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
    });
});