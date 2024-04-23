import React from 'react';
import AttributeTreeView from '@site/src/components/AttributeTreeView';
import AttributeMapperPreview from '@site/src/components/AttributeMapperPreview';
import attributeData from '@site/static/attribute-data.json';
import { AttributeMapperContext, AttributeMapperDataContext } from "./AttributeMapperContext";
import BrowserOnly from '@docusaurus/BrowserOnly';

/* Set parent for each child */
const setParent = (o) => {
    if (o.children != undefined) {
        for (let n = 0; n < o.children.length; n++) {
            o.children[n].parent = o;
            setParent(o.children[n]);
        }
    }

    return o;
}

const Mapper = () => {
    const [selectedAttributes, setSelectedAttributes] = React.useState([]);
    const [data, setData] = React.useState(setParent({ children: attributeData }).children);
    return (<AttributeMapperDataContext.Provider value={{ data, setData }}>
        <AttributeMapperContext.Provider value={{ selectedAttributes, setSelectedAttributes }}>
            <div className="column left">
                <AttributeTreeView data={data} />
            </div>

            <div className="column right">
                <AttributeMapperPreview />
            </div>
        </AttributeMapperContext.Provider>
    </AttributeMapperDataContext.Provider>);
};

export default function AttributeMapper() {
    return (
        <BrowserOnly>
            {() => <Mapper />}
        </BrowserOnly>
    );
}