# The Editor model

An editor instance requires an `EditorConfig` and produces an `EditorDocument`.

## `EditorConfig`
The `EditorConfig` contains static information about available `EditorComponents` and `Placeholders`

### `EditorComponent`
An `EditorComponent` represents a single draggable object which can be placed in the `EditorDocument`
`EditorComponents` are grouped in `EditorComponentGroups`.
An `EditorComponent` can have a scope which references the placeholders which are available for the component.

#### `EditorProperty`
Every Angular2-Component which is used for an `EditorComponent` can define mutliple `EditorProperties`. Every `EditorProperty` 
will be displayed as an input if the component is selected in the editor and can be edited by the user.

### `EditorComponentGroup`
Each `EditorComponentGroup` has a name and a list of `EditorComponents`

### `PlaceholderMap`
Maps available placeholders from the name to be used in generated template string to a user readable label to be displayed in the editor.
A single entry can also contain a nested map of placeholders. Nested `PlaceholderMaps` can be restricted by setting a scope on an `EditorComponent`.


## `EditorDocument` & `EditorDocumentInterface`

An `EditorDocument` maps a single `blockId` to a list of `EditorItems`. Every of these lists will be rendered in a dropzone having this id.

### `EditorItem`, `EditorElement` & `EditorSection`
An `EditorItem` could be either an `EditorElement`, which represents a concrete instance of an `EditorComponent` or an `EditorSection` which represents the contents of a single template file.

