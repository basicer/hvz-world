import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import React from 'react';
import Markdown from "markdown-to-jsx";
import Router, {route} from 'preact-router';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
  } from 'recoil';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import './water.css';

const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  
    let update = () => setSelf(JSON.parse(localStorage.getItem(key)));

    window.addEventListener('storage', update);

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });

    return () => window.removeEventListener('storage', update);
};

const inventory = atom({key: 'inventory', default: [], effects: [localStorageEffect('inventory')]});
const where = atom({key: 'where', default: 'docks', effects: [localStorageEffect('where')]});

function Take({id, children}) {
    let [inv, setInv] = useRecoilState(inventory);
    let take = () => {
        enqueueSnackbar(`You took the ${id}`, { variant: 'success' });
        if (inv.indexOf(id) != -1) return;
        setInv(inv.concat([id]));
        
    }
    return <button onClick={take}>{children}</button>
}

function Need({id, children}) {
    let inv = useRecoilValue(inventory);
    if (inv.indexOf(id) != -1) 
        return <div>{children}</div>
    
}

export const MarkdownOptions = {
	overrides: {
		a: { component: "a" },
        Take: { component: Take },
        Need: { component: Need }
	},
};


const Page = ({name}) => {
    let [content, setContent] = useState('');
    useEffect(() => {
        import(`./content/${name}.md`).then(c => setContent(c.default));
    }, [name])

    return <Markdown options={MarkdownOptions}>{content}</Markdown>
}

const Inventory = () => {
    let inv = useRecoilValue(inventory);
    return <div>Inventory: {(inv || []).join(" ")}</div>
}

const Travel = ({name}) => {
    let setWhere = useSetRecoilState(where);
    useEffect(() => {
        route('/');
        setWhere(name);
    }, []);
    return <div>Travel?</div>
}

const Main = () => {
    let place = useRecoilValue(where);
    return <Router>
        <Page path="/" name={place}></Page>
        <Travel path="/:name"></Travel>
    </Router>
}

const App = <RecoilRoot>
<SnackbarProvider>
    <Main />

    <Inventory />
</SnackbarProvider>
</RecoilRoot>



render(App, document.getElementById("app"));