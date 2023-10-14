import { render } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
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
const where = atom({key: 'where', default: 'index', effects: [localStorageEffect('where')]});
const cooldowns = atom({key: 'cooldowns', default: {}, effects: [localStorageEffect('cooldowns')]});

function Take({id, onTake, cooldown, time, children}) {
    let [inv, setInv] = useRecoilState(inventory);
    let [cds, setCooldowns] = useRecoilState(cooldowns);
    let take = () => {
        if (cooldown) setCooldowns({...cds, [cooldown]: new Date().valueOf() + 1000 * (time || 300)})
        enqueueSnackbar(onTake || `You took the ${id}`, { variant: 'success' });
        if (inv.indexOf(id) != -1) return;
        setInv(inv.concat([id]));
        
    }
    return <button onClick={take}>{children}</button>
}

function Go({id, children}) {
    let [palce, setPlace] = useRecoilState(where);
    let go = () => {
       setPlace(id);
    }
    return <button onClick={go}>{children}</button>
}

function Need({id, children}) {
    let inv = useRecoilValue(inventory);
    if (inv.indexOf(id) != -1) 
        return <div>{children}</div>   
}

function Cooldown({id, children}) {
    let [cds, setCooldowns] = useRecoilState(cooldowns);
    let [nao, setNao] = useState(new Date().valueOf());
    useEffect(() => {
        let i = setInterval(() => setNao(new Date().valueOf()), 500);
        return () => clearInterval(i);
    });
    if (cds[id] > nao) return <div>Waiting {Math.floor((cds[id] - nao)/1000)}s...</div>

    return <>{children}</>
}

export const MarkdownOptions = {
	overrides: {
		a: { component: "a" },
        Take: { component: Take },
        Need: { component: Need },
        Go: { component: Go },
        Cooldown: { component: Cooldown },
	},
};


const Page = ({name}) => {
    let [content, setContent] = useState('');
    useEffect(() => {
        import(`./content/${name}.md`).then(c => setContent(c.default));
    }, [name])

    return <>
        <Markdown options={MarkdownOptions}>{content}</Markdown>
    </>
}

const Inventory = () => {
    let inv = useRecoilValue(inventory);
    let ref = useRef();
    useEffect(() => {
        let close = () => ref.current.close();
        ref.current.addEventListener("click", close);
        return () => ref.current.removeEventListener("click", "close")
    }, [ref])
    return <>
        <dialog id="dialog" ref={ref}>
            <header>Inventory</header>
            <ul>
                {(inv || []).map((v) => <li>{v}</li>)}
            </ul>
        </dialog>
        <div style={{position: 'fixed', left: 5, right: 5, bottom: 5}}>
            <button style={{width: '100%'}} onClick={() => ref.current.showModal()}>Inventory</button>
        </div>
    </>
}

const Travel = ({name}) => {
    let setWhere = useSetRecoilState(where);
    useEffect(() => {
        route('/', true);
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