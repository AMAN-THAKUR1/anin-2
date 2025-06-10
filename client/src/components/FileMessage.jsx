import React from 'react'

function FileMessage({ item, name }) {

    const handleDownloadFile = (item) => {
        const a = document.createElement('a');
        a.href = item.downloadUrl;
        a.download = item.fileName;
        a.click();
    }

    return (

        <div className={`message flex ${item.name === name ? "justify-end" : "justify-start"} p-3`}>
            <div className="flex justify-around items-center gap-[20px] max-w-40 bg-blue-500 rounded-lg p-2">
                <div><i className="fa fa-file-text" aria-hidden="true"></i></div>
                <div className = "max-w-30 overflow-hidden">{item.fileName}</div>
                <div className="cursor-pointer">
                    <button key={item.downloadUrl} onClick={()=>handleDownloadFile(item)}>
                        <i className="fa fa-download" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FileMessage
