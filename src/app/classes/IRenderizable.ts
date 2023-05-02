import { LayoutContent } from '../components/interfaces/FlayoutConfig.interface';
import { FlayoutConfig } from '../components/interfaces/FlayoutConfig.interface';

export interface IRenderizable {
  RenderLayout(
    path: string,
    config: FlayoutConfig,
    content: LayoutContent
  ): void;
  RenderControl(path: string, name: string, data: any): void;

  RenderGroup(path: string, name: string, data: any, classes: string): void;

  RenderArray(path: string, name: string, data: any[], classes: string): void;
}
