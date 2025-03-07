import { IDecoration } from "../../entities/decoration.entity"

export default interface IDecorRepository{
    findDecorByName(decorationName: string): Promise<IDecoration | null>
    addDecor(decoration: any): Promise<IDecoration>
    getDecor(): Promise<IDecoration[]>
    updateDecor( decorationId: string, updatedData: Partial<IDecoration>): Promise<IDecoration | null>
    findDecorById(decorationId: string): Promise<IDecoration | null>
    deleteDecor(decorationId: string): Promise<void>
    isList(decorationId: string, updatedData: Partial<IDecoration>): Promise<IDecoration | null>
}