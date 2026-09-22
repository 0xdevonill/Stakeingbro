pragma solidity ^0.8.24;

/// @notice Interface for a StakeBro token factory on Robinhood Chain.
/// Addresses must be supplied via environment variables. Do not treat this
/// file as an audited deployment.
interface IStakeBroTokenFactory {
    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint8 decimals,
        uint16 creatorAllocationBps,
        uint16 stakingAllocationBps,
        uint16 rewardAllocationBps,
        uint256 initialLiquidityWei
    ) external payable returns (address token);
}

interface IStakeBroStaking {
    function stake(uint256 poolId, uint256 amount) external;
    function unstake(uint256 poolId, uint256 amount) external;
    function claim(uint256 poolId) external;
    function compound(uint256 poolId) external;
    function pendingRewards(address user, uint256 poolId) external view returns (uint256);
}
