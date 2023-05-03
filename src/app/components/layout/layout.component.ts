import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynLeafDirective } from 'src/app/directives/dyn-leaf.directive';
import { ObjectChildsAreObjects } from 'src/app/utils/objects-utils';
import { FormRenderer } from '../../classes/FormRenderer';
import { DynFormService } from '../../services/dyn-form.service';
import {
  FlayoutConfig,
  LayoutContent,
} from '../interfaces/FlayoutConfig.interface';
import { Layouts } from 'src/app/enums/layouts.enum';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  public classes = 'flex ';

  //* Input properties

  @Input() JsonPath: string = '';
  @Input() config: FlayoutConfig | undefined;
  @Input() content: LayoutContent | undefined;

  //* Render nodes

  @ViewChild(DynLeafDirective, { static: true }) leaf!: DynLeafDirective;

  constructor(
    private DynFormService: DynFormService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createComponentClassesList();
    this.parseContent();
  }

  createComponentClassesList() {
    if (this.config?.direction) {
      this.classes += `${this.config?.direction} `;
    }

    if (this.config?.alignment) {
      const { alignment } = this.config;

      this.classes += `${alignment.x} ${alignment.y} `;
    }

    if (this.config?.gap) {
      this.config.direction == 'flex-row'
        ? (this.classes += `gap-${this.config.gap}`)
        : (this.classes += `column-gap-${this.config.gap}`);
    }
  }

  parseContent() {
    const renderer = new FormRenderer(
      this.leaf.viewContainerRef,
      this.DynFormService
    );

    Object.entries(this.content as LayoutContent).forEach(
      ([key, entryContent]) => {
        if (key == Layouts.FLayout) {
          const { config, content } = entryContent as any;
          renderer.RenderLayout(this.JsonPath, config, content);
        } else if (Array.isArray(entryContent)) {
          renderer.RenderArray(this.JsonPath, key, entryContent, this.classes);
        } else if (ObjectChildsAreObjects(entryContent)) {
          renderer.RenderGroup(this.JsonPath, key, entryContent, this.classes);
        } else {
          renderer.RenderControl(this.JsonPath, key, entryContent);
        }
      }
    );
    this.changeDetectorRef.detectChanges();
  }
}
