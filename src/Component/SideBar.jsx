import React, { useEffect, useState } from "react";
import { BiMessageSquareAdd, BiDevices } from "react-icons/bi";
import { FiLayers } from "react-icons/fi";
import { FaRegClone } from "react-icons/fa";
import {
  AiOutlineTablet,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { TbPageBreak } from "react-icons/tb";
import { blocks } from "../Blocks";
import { RenderCustomBlock } from "../Helper/renderCustomBlocks";
import { TbFileExport } from "react-icons/tb";
import juice from "juice";
import Layers from "./Layers";
import { usePageManager } from "../store/pageManage";
import { iconStyles } from "../Constant";

const SideBar = ({ editor }) => {
  const [showBlock, setShowBlock] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [subBlockisSelected, setSubBlockIsSelected] = useState(false);
  const [selectedBlock, setselectedBlock] = useState("");
  const [selectedSubBlock, setselectedSUbBlock] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [PageNo, setPageNo] = useState(1);
  const [PageName,setPageName] = useState('')
  const [PageList, setPageList] = useState([]);
  const [selectPage, setSelectPage] = useState("");

  const SetPageID = usePageManager((state) => state.setPageId);

  const OpenBlockContaier = () => {
    setShowBlock(!showBlock);
    setShowLayers(false);
  };

  const OpenLayersContainer = () => {
    setShowLayers(!showLayers);
    setShowBlock(false);
  };

  const selectBlock = (blc) => {
    setIsSelected(true);
    setselectedBlock(blc.Category);
  };

  const findSubBlockIsSelected = (subId) => {
    setSubBlockIsSelected(true);
    setselectedSUbBlock(subId);
  };

  useEffect(() => {
    if (subBlockisSelected) {
      const blockContainer = editor.BlockManager.render();
      const $ = editor.$;
      $("#block-container").append(blockContainer);
    }
  }, [subBlockisSelected]);

  const onDragComponent = () => {
    setShowBlock(false);
  };

  function textToDispkay() {
    return blocks.map((block) => {
      if (block.Category === selectedBlock) {
        return block.SubCategory.map((subCategory, index) => {
          return (
            <div
              key={index}
              onMouseEnter={() => findSubBlockIsSelected(subCategory.id)}
              className={`subcat ${
                selectedSubBlock === subCategory.id && "selected"
              }`}
            >
              {subCategory.label}
            </div>
          );
        });
      }
    });
  }

  const OpenPageManager = () => {
    setShowPage(!showPage);
  };

  const exportCode = () => {
    var html = editor.getHtml();
    var css = editor.getCss();
    const final = juice.inlineContent(html, css);
    console.log(final);
  };

  const CreatePage = () => {
    editor.Pages.add({
      id: "", // without an explicit ID, a random one will be created
      name: "Page " + PageNo,
      styles: "", // or a JSON of styles
      component: "", // or a JSON of components
    });
    const getAllPage = editor.Pages.getAll();
    setPageList(getAllPage);
    setPageNo(PageNo + 1);

    console.log(PageNo);
  };

  const SelectPage = (pageId) => {
    setSelectPage(pageId);
    SetPageID(pageId);
    const somePage = editor.Pages.get(pageId);
    editor.Pages.select(somePage);
  };

  const ClonePage = (pageName) => {
    // Get wrapper component of the selected page
    const wrapper = editor.Pages.getSelected().getMainComponent();
    // Add new page with a clone of the wrapper
    editor.Pages.add({
        id: "",
        name: pageName + " (Copy)",
        component: wrapper.clone(),
      },{ select: true }
    );

    const getAllPage = editor.Pages.getAll();
    setPageList(getAllPage);
  };

  const DeletePage = (pgId) => {
    const DeleteSelectedPage = editor.Pages.get(pgId);
    editor.Pages.remove(DeleteSelectedPage);

    const getAllPage = editor.Pages.getAll();
    setPageList(getAllPage);

    SelectPage(getAllPage[getAllPage.length - 1].id);
  };

  useEffect(() => {
    if (editor) {
      editor.Pages.getMain().setName("MainPage");
      const getAllPage = editor.Pages.getAll();
      setSelectPage(getAllPage[0].id);
      setPageList(getAllPage);
    }
  }, [editor]);

  return (
    <div className="sidebar icons" id="panels-container">
      <BiMessageSquareAdd
        style={{
          width: "20px",
          height: "40px",
          cursor: "pointer",
          marginTop: "30px",
        }}
        onClick={() => OpenBlockContaier()}
      />
      <TbFileExport style={iconStyles} onClick={() => exportCode()} />
      <FiLayers style={iconStyles} onClick={() => OpenLayersContainer()} />
      <AiOutlineTablet style={iconStyles} />
      <div className={`menubar ${!showBlock && "show"} `}>
        <div className="menubar-topbar">
          <span>Add Element</span>
        </div>
        <div className="sub-block">
          <div className="sub-block-type">
            {blocks.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseEnter={() => selectBlock(item)}
                  className={`category ${
                    selectedBlock === item.Category && "selected"
                  }`}
                >
                  {item.Category}
                </div>
              );
            })}
          </div>
          {isSelected && (
            <div className="sub-block-type">{textToDispkay()}</div>
          )}
          {isSelected && subBlockisSelected && (
            <div className="sub-block-type">
              <div
                className="block-container"
                draggable
                onDrag={() => onDragComponent()}
                id="block-container"
              >
                {RenderCustomBlock({
                  bm: editor.BlockManager,
                  selectedBlock: selectedBlock,
                  selectedSubBlock: selectedSubBlock,
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Layers showLayers={showLayers} />
      <TbPageBreak style={iconStyles} onClick={() => OpenPageManager()} />
      <div
        id="page-manager"
        className={`page-manager ${showPage ? "pshow" : "phide"}`}
      >
        <div>
          <button onClick={() => CreatePage()}>Add Page</button>
        </div>
        <div className="pagelist">
          {PageList.map((pages) => {
            return (
              <div
                className={`pageContainer ${
                  selectPage === pages.id ? "selectPage" : "notSelected"
                }`}
              >
                <span onClick={() => SelectPage(pages.id)} className="page">
                  {pages.attributes.name}
                </span>
                {pages.attributes.name !== "MainPage" ? (
                  <div className="page-actions">
                    <AiOutlineEdit />
                    <FaRegClone  onClick={() => ClonePage(pages.attributes.name)} />
                    <AiOutlineDelete onClick={() => DeletePage(pages.id)} />
                  </div>
                ) : (
                  <div className="page-actions">
                    <FaRegClone onClick={() => ClonePage(pages.attributes.name)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
