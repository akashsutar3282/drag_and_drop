
const canvas = document.getElementById('canvas');
const tools = document.querySelectorAll('.tool');
let currentId = 0;
let selected = null;

tools.forEach(tool => {
    tool.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', e.target.dataset.type);
    });
});

canvas.addEventListener('dragover', e => e.preventDefault());

canvas.addEventListener('drop', e => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const x = e.offsetX;
    const y = e.offsetY;
    const el = document.createElement('div');
    el.className = 'draggable';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.id = `el-${currentId++}`;

    switch (type) {
        case 'text':
            el.innerText = 'Edit Me';
            el.style.fontSize = '16px';
            break;
        case 'image':
            el.innerHTML = '<img src="https://via.placeholder.com/100" style="max-width:100px;">';
            break;
        case 'button':
            el.innerHTML = '<button>Click Me</button>';
            break;
    }

    el.addEventListener('click', () => selectElement(el));
    makeDraggable(el);
    canvas.appendChild(el);
});

function makeDraggable(el) {
    let offsetX, offsetY;

    el.addEventListener('mousedown', e => {
        if (e.target.tagName !== 'IMG' && e.target.tagName !== 'BUTTON') {
            selected = el;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            canvas.addEventListener('mousemove', drag);
            canvas.addEventListener('mouseup', stopDrag);
        }
    });

    function drag(e) {
        el.style.left = `${e.offsetX - offsetX}px`;
        el.style.top = `${e.offsetY - offsetY}px`;
    }

    function stopDrag() {
        canvas.removeEventListener('mousemove', drag);
        canvas.removeEventListener('mouseup', stopDrag);
    }
}

function selectElement(el) {
    selected = el;
    document.getElementById('selectedId').value = el.id;
    const text = el.innerText || '';
    const color = el.style.color || '#000000';
    const fontSize = parseInt(el.style.fontSize) || 16;
    const img = el.querySelector('img');
    document.getElementById('propText').value = text.trim();
    document.getElementById('propFontSize').value = fontSize;
    document.getElementById('propColor').value = color;
    document.getElementById('propImgURL').value = img ? img.src : '';
}

document.getElementById('propForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('selectedId').value;
    const el = document.getElementById(id);
    if (!el) return;

    const text = document.getElementById('propText').value;
    const fontSize = document.getElementById('propFontSize').value;
    const color = document.getElementById('propColor').value;
    const imgURL = document.getElementById('propImgURL').value;

    if (el.querySelector('img')) {
        el.innerHTML = `<img src="${imgURL}" style="max-width:100px;">`;
    } else if (el.querySelector('button')) {
        el.querySelector('button').innerText = text;
        el.style.color = color;
        el.style.fontSize = fontSize + 'px';
    } else {
        el.innerText = text;
        el.style.color = color;
        el.style.fontSize = fontSize + 'px';
    }
});
