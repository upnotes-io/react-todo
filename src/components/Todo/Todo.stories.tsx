import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Todo, { TodoAppProps } from "./Todo";

export default {
  title: "Components/Todo",
  component: Todo,
  argTypes: {
    defaultItems: [{name: "test it", isComplete: false, uuid: '1'}],
  },
} as Meta;

const Template: Story<TodoAppProps> = (args) => <Todo {...args} />;

export const Example = Template.bind({});
Example.args =  {defaultItems: [{name: "test it", isComplete: false, uuid: '1'}]}

