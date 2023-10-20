import './../styles.css'
import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

function Main() {
    useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
            "src",
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
                includedLanguages: 'en,ms,ta,mr,en,gu,bho,bn,doi,hi,ja,kn,ml,ne,pa,ru,sd,te,ur,uk,uk',
            },
            "google_translate_element"
        );
    };
    return (
        <>
            <Navbar />

            <Outlet />

            <Footer />
        </>
    )
}

export default Main