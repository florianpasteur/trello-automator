const button = document.querySelector('#copyList');

button.addEventListener('click', e => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        fetch('https://trello.com/b/MQqAHWhx.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
            .then(response => response.json())
            .then(board => {
                const listRecetteDeLaSemaine = "60698e3a12846d030ac0c70e";
                const checklistsIds = board.cards.filter(card => card.idList === listRecetteDeLaSemaine).flatMap(card => card.idChecklists);
                const items = board.checklists.filter(checklist => checklistsIds.includes(checklist.id)).flatMap(checklist => checklist.checkItems);

                let itemsSorted = items.map(item => item.name).sort((a,b) => {
                    return a.replaceAll(/\d/g, '').localeCompare(b.replaceAll(/\d/g, ''));
                });
                const clipboardContent = itemsSorted.join('\n');
               writeText(clipboardContent).then(() => {
                    //clipboard successfully set
                    debugger
                }, (err) => {
                    //clipboard write failed, use fallback
                    debugger
                   console.log(err);
               });



                console.log(clipboardContent);
            })
            .catch(error => console.log('Error:', error));
    });
    // Id List: "60698e3a12846d030ac0c70e"
    debugger
});

console.log("lodaed")

const readText = () =>
new Promise((resolve, reject) => {
    // Create hidden input to receive text
    const el = document.createElement('textarea')
    el.value = 'before paste'
    document.body.append(el)

    // Paste from clipboard into input
    el.select()
    const success = document.execCommand('paste')

    // The contents of the clipboard
    const text = el.value
    el.remove()

    if (!success) reject(new Error('Unable to read from clipboard'))

    // Resolve with the contents of the clipboard
    resolve(text)
})

const writeText = (text) =>
new Promise((resolve, reject) => {
    // Create hidden input with text
    const el = document.createElement('textarea')
    el.value = text
    document.body.append(el)

    // Select the text and copy to clipboard
    el.select()
    const success = document.execCommand('copy')
    el.remove()

    if (!success) reject(new Error('Unable to write to clipboard'))

    resolve(text)
})
