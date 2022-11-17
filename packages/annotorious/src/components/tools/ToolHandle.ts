export type ToolHandle = string

export const ToolHandle = (value: string | number) => `HANDLE-${value}`;

ToolHandle.SHAPE = 'SHAPE';

ToolHandle.TOP = 'TOP';

ToolHandle.RIGHT = 'RIGHT';

ToolHandle.BOTTOM = 'BOTTOM';

ToolHandle.LEFT = 'LEFT';

ToolHandle.TOP_LEFT = 'TOP_LEFT';

ToolHandle.TOP_RIGHT = 'TOP_RIGHT';

ToolHandle.BOTTOM_RIGHT = 'BOTTOM_RIGHT';

ToolHandle.BOTTOM_LEFT = 'BOTTOM_LEFT';

ToolHandle
