import React from 'react';
import StyleEditor from "./StyleEditor.js";
import ResumeEditor from "./ResumeEditor.js";
import "./style/reset.css";
import ReactDOM from 'react-dom';
import St from './styleEditorContent';
import Re from './resumeEditorContent';
import Prism from "prismjs";
import co from "co";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: "",
        };
        this.interval = 30;
        this.resumeEditorContent = Re;
        this.styleEditorContent = St;
    }

    addToStyle(char:any) {
        this.setState({
            style: this.state.style + char,
        });
    }

    replaceStyle(style:any) {
        this.setState({
            style: style,
        });
    }
    replaceStyleEditorContent() {

    }
    showStyleEditorContent(n:number) {
        let lastContentLength = 0;
        if (n !== 0) {lastContentLength = this.state.style.length;}
        let style = this.styleEditorContent[n];
        let len = style.length;
        return new Promise((resolve, reject) => {
            let showStyle = function () {
                let currentLen = this.state.style.length - lastContentLength;
                if (currentLen < len) {
                    let char = style.substring(currentLen, currentLen+1);
                    this.refs.StyleEditor.addToContent(char);
                    this.addToStyle(char);
                    setTimeout(showStyle, this.interval);
                } else {
                    resolve();
                }
            }.bind(this);
            showStyle();
        });
    }

    showResumeContent() {
        let content = this.resumeEditorContent;
        let len = content.length;
        return new Promise((resolve, reject) => {
            let showContent = function() {
                let currentLen = this.refs.ResumeEditor.getCurrentContentLength();
                if (currentLen < len) {
                    let char = content.substring(currentLen, currentLen+1);
                    this.refs.ResumeEditor.addToContent(char);
                    setTimeout(showContent, this.interval);
                } else {
                    resolve();
                }
            }.bind(this);
            showContent();
        });
    }

    setResumeMarkdown() {
        return new Promise((resolve, reject) => {
            setTimeout(this.refs.ResumeEditor.setIsMarkdown(true), this.interval);
            resolve();
        });
    }

    async startShow() {
        await this.showStyleEditorContent(0).then(
            () => {
                console.log('done! show Content 0');
            });
        await this.showResumeContent();
        await this.showStyleEditorContent(1).then(
            () => {
                console.log('done! show Content 1')
            });
        await this.setResumeMarkdown();
        await this.showStyleEditorContent(2).then(
            () => {
                console.log('done! show Content 2')
            });
    }

    componentDidMount() {
        this.startShow();
    }

    render(){
        return(
            <div>
                <StyleEditor ref="StyleEditor" />
                <ResumeEditor ref="ResumeEditor" />
                <style>
                    {this.state.style}
                </style>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));
