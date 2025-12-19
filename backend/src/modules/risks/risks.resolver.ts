import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RisksService } from './risks.service';
import { Risk } from './entities/risk.entity';
import { CreateRiskInput } from './dto/create-risk.input';
import { UpdateRiskInput } from './dto/update-risk.input';

@Resolver(() => Risk)
export class RisksResolver {
  constructor(private readonly risksService: RisksService) {}

  @Mutation(() => Risk)
  createRisk(@Args('createRiskInput') createRiskInput: CreateRiskInput) {
    return this.risksService.create(createRiskInput);
  }

  @Query(() => [Risk], { name: 'risks' })
  findAll() {
    return this.risksService.findAll();
  }

  @Query(() => Risk, { name: 'risk' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.risksService.findOne(id);
  }

  @Mutation(() => Risk)
  updateRisk(@Args('updateRiskInput') updateRiskInput: UpdateRiskInput) {
    return this.risksService.update(updateRiskInput.id, updateRiskInput);
  }

  @Mutation(() => Risk)
  removeRisk(@Args('id', { type: () => Int }) id: number) {
    return this.risksService.remove(id);
  }
}
