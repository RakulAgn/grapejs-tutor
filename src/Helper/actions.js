import { showToast } from "../Component/CustomToast/toast";
import { blocks } from "../Blocks";

const getAllComponents = (model, result = []) => {
  result.push(model);
  model.components().each((mod) => getAllComponents(mod, result));
  return result;
};

export const RestrictTemplatesToOne = (editor, page) => {
  // console.log(editor.Pages.get(page).getFrames);

  editor.on("component:add", function (e) {
    if (editor.Pages.getSelected) {
      const GetAllComponentsFromCanvas = getAllComponents(
        editor.DomComponents.getWrapper()
      );

      GetAllComponentsFromCanvas.map((canvas) => {
        return blocks.map((item) => {
          return item.SubCategory.map((subItem) => {
            return subItem.modal.map((val) => {
              let RequiredConiditon =
                canvas.ccid !== val.id && canvas.ccid.includes(val.id);

              if (RequiredConiditon) {
                showToast("info", "Remove the Existing Templates");
                return e.remove();
              }
            });
          });
        });
      });
    }
  });
};
