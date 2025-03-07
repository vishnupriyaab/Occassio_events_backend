import { IDecoration, IDecorationCreate } from "../../entities/decoration.entity"

export default interface IDecorServices{
    getDecorations(): Promise<IDecoration[]>
    addDecoration(decorData: IDecorationCreate): Promise<IDecoration>
    updatedecoration(decorationId: string, updatedData: any): Promise<IDecoration | null>
    deletedecoration(decorationId: string): Promise<void>
    isList( decorationId: string, updatedData: Partial<IDecoration> ): Promise<IDecoration | null>
}