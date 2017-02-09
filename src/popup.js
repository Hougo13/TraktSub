let form = document.getElementById("form");

chrome.storage.sync.get('languages', ({languages}) => {
    languages.forEach((language) => {
        let input = document.querySelector("input[value="+language+"]");
        input.checked = true;
        console.log(input);
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let f = new FormData(form);
    let languages = f.getAll('languages');

    console.log(languages);

    chrome.storage.sync.set({languages},() => {
        console.log('saved');
        window.close();
    });

});