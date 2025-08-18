import { Form, useNavigation } from "react-router";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Button, TextInput } from "@mantine/core";
import { useState } from "react";

interface EditorProps {
  initialData?: {
    title?: string;
   content?: string;
  };
  submitLabel?: string;
}

export default function Editor({ initialData, submitLabel }: EditorProps) {
  const navigation = useNavigation();
  const [content, setContent] = useState(
    initialData?.content || "<p>Write your post here...</p>"
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <Form method="post">
      <TextInput
        name="title"
        label="Post Title"
        placeholder="Enter your post title"
        mb="md"
        required
        defaultValue={initialData?.title || ""}
      />

      <input type="hidden" name="content" value={content} readOnly />

      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>

      <Button mt="md" type="submit" loading={navigation.state === "submitting"}>
        {submitLabel || "Save Post"}
      </Button>
    </Form>
  );
}
